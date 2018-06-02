#include <node_api.h>
#include <assert.h>
#include <stdlib.h>

napi_value Range(napi_env env, napi_callback_info info)
{
    napi_status status;

    size_t argc = 4;
    napi_value args[4];
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    assert(status == napi_ok);

    int32_t start, end, step;
    bool isRangeRight = false;
    switch (argc)
    {
    case 1:
        status = napi_get_value_int32(env, args[0], &start);
        end = start;
        start = 0;
        step = (end < start) ? -1 : 1;
        break;
    case 2:
        status = napi_get_value_int32(env, args[0], &start);
        assert(status == napi_ok);
        status = napi_get_value_int32(env, args[1], &end);
        step = (end < start) ? -1 : 1;
        break;
    case 3:
        status = napi_get_value_int32(env, args[0], &start);
        assert(status == napi_ok);
        status = napi_get_value_int32(env, args[1], &end);
        assert(status == napi_ok);
        status = napi_get_value_int32(env, args[2], &step);
        break;
    case 4:
        status = napi_get_value_int32(env, args[0], &start);
        assert(status == napi_ok);
        status = napi_get_value_int32(env, args[1], &end);
        assert(status == napi_ok);
        status = napi_get_value_int32(env, args[2], &step);
        status = napi_get_value_bool(env, args[3], &isRangeRight);
        break;
    default:
        napi_throw_error(env, nullptr, "range expects only start (and optional end, step) arguments");
        return nullptr;
    }
    assert(status == napi_ok);
    if (step == 0)
    {
        napi_throw_type_error(env, nullptr, "step cant be set to 0");
        return nullptr;
    }
    if (isRangeRight)
    {
        step = -abs(step);
        int32_t current = end;
        end = start;
        start = current;
    }
    napi_value result;
    status = napi_create_array(env, &result);
    assert(status == napi_ok);

    uint32_t index = 0;
    napi_value value;
    while (
        (!isRangeRight)
            ? (step > 0) ? (start < end) : (start > end)
            : (step > 0) ? (start <= end) : (start >= end))
    {
        status = napi_create_int32(env, start, &value);
        assert(status == napi_ok);
        status = napi_set_element(env, result, index, value);
        assert(status == napi_ok);
        index++;
        start += step;
    }

    return result;
}

#define DECLARE_NAPI_METHOD(name, func)         \
    {                                           \
        name, 0, func, 0, 0, 0, napi_default, 0 \
    }

napi_value Init(napi_env env, napi_value exports)
{
    napi_status status;
    napi_property_descriptor desc = DECLARE_NAPI_METHOD("range", Range);
    status = napi_define_properties(env, exports, 1, &desc);
    assert(status == napi_ok);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
